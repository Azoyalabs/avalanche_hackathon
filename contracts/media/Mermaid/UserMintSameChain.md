sequenceDiagram
    actor User
    User->>+CCIP-BnM: transferAndCall
    CCIP-BnM->>+Receiver: onTokenTransfer
    Receiver-->>+Receiver: Perform Validation
    Receiver->>+Summit: mint
    Summit->>+User: User receives minted token

