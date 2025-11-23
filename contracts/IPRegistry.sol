// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ChainPub Publication Registry
/// @notice Minimal registry that anchors creative works as on-chain publications.
/// @dev Stores only hashes + lightweight metadata, not raw files.
contract IPRegistry {
    uint256 public constant MAX_TITLE_LENGTH = 256;
    uint256 public constant MAX_PARENT_HASH_LENGTH = 128;

    struct Publication {
        address author;
        bytes32 fileHash;
        string title;
        string parentHash; // optional hash of a parent work (for forks/derivatives)
        uint256 timestamp;
    }

    /// @notice Emitted when a new publication is registered.
    event PublicationRegistered(
        address indexed author,
        bytes32 indexed fileHash,
        string title,
        string parentHash,
        uint256 timestamp
    );

    /// @dev Maps file hash to a single publication record.
    mapping(bytes32 => Publication) private _publications;

    /// @notice Register a new publication on-chain.
    /// @param fileHash Keccak-256 hash (or other digest) of the work.
    /// @param title Short human-readable title.
    /// @param parentHash Optional hash of a parent work (empty string if none).
    function registerPublication(
        bytes32 fileHash,
        string calldata title,
        string calldata parentHash
    ) external {
        require(fileHash != bytes32(0), "file hash required");
        require(_publications[fileHash].timestamp == 0, "already registered");
        require(bytes(title).length <= MAX_TITLE_LENGTH, "title too long");
        require(
            bytes(parentHash).length <= MAX_PARENT_HASH_LENGTH,
            "parent too long"
        );

        Publication memory pub = Publication({
            author: msg.sender,
            fileHash: fileHash,
            title: title,
            parentHash: parentHash,
            timestamp: block.timestamp
        });

        _publications[fileHash] = pub;

        emit PublicationRegistered(
            pub.author,
            pub.fileHash,
            pub.title,
            pub.parentHash,
            pub.timestamp
        );
    }

    /// @notice Fetch a publication by its file hash.
    /// @param fileHash Hash that was registered previously.
    function getPublication(
        bytes32 fileHash
    )
        external
        view
        returns (
            address author,
            bytes32 storedHash,
            string memory title,
            string memory parentHash,
            uint256 timestamp
        )
    {
        Publication memory pub = _publications[fileHash];
        require(pub.timestamp != 0, "not found");

        return (
            pub.author,
            pub.fileHash,
            pub.title,
            pub.parentHash,
            pub.timestamp
        );
    }
}
