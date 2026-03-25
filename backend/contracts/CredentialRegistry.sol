// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CredentialRegistry is Ownable {
    struct CredentialRecord {
        bytes32 credentialHash;
        address institution;
        uint256 registeredAt;
        bool revoked;
    }

    mapping(string => CredentialRecord) private credentialRecords;

    event CredentialRegistered(string indexed did, bytes32 indexed credentialHash, address indexed institution);
    event CredentialRevoked(string indexed did, address indexed revokedBy);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function registerCredential(string calldata did, bytes32 credentialHash) external returns (bytes32) {
        require(bytes(did).length > 0, "DID is required");
        require(credentialHash != bytes32(0), "Credential hash is required");

        CredentialRecord storage record = credentialRecords[did];
        require(record.registeredAt == 0, "Credential already registered");

        credentialRecords[did] = CredentialRecord({
            credentialHash: credentialHash,
            institution: msg.sender,
            registeredAt: block.timestamp,
            revoked: false
        });

        emit CredentialRegistered(did, credentialHash, msg.sender);
        return credentialHash;
    }

    function getCredentialHash(string calldata did) external view returns (bytes32) {
        CredentialRecord storage record = credentialRecords[did];
        if (record.revoked) {
            return bytes32(0);
        }
        return record.credentialHash;
    }

    function verifyCredential(string calldata did, bytes32 credentialHash) external view returns (bool) {
        CredentialRecord storage record = credentialRecords[did];
        if (record.registeredAt == 0 || record.revoked) {
            return false;
        }
        return record.credentialHash == credentialHash;
    }

    function revokeCredential(string calldata did) external {
        CredentialRecord storage record = credentialRecords[did];
        require(record.registeredAt != 0, "Credential not found");
        require(!record.revoked, "Credential already revoked");
        require(msg.sender == record.institution || msg.sender == owner(), "Not authorized");

        record.revoked = true;
        emit CredentialRevoked(did, msg.sender);
    }
}
