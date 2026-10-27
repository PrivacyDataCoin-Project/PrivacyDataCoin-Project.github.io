window.PDC_LAYERS = [
  {
    id: "stealth",
    n: "01",
    name: "Stealth addresses",
    hides: "receiver",
    title: "The published address never lands on the chain.",
    body: "Each output pays a one-time address derived for that transfer. Your Px address is for people you send it to, not for the public ledger.",
    seal: ["to"],
    meta: [["Hides", "Receiver"], ["In the source", "One-time outputs on wallet transfers"]]
  },
  {
    id: "ring",
    n: "02",
    name: "d/v-CLSAG",
    hides: "sender",
    title: "Your input sits among decoys.",
    body: "The signature proves you own one input in the set. It does not tell an observer which one. The default decoy set has 10 members. After hard fork 4 the mandatory size is 15.",
    seal: ["from"],
    meta: [["Hides", "Sender"], ["Decoys", "10 default, 15 after HF4"]]
  },
  {
    id: "amount",
    n: "03",
    name: "Commitments",
    hides: "amount",
    title: "The amount stays inside a commitment.",
    body: "Pedersen commitments hide the value. Bulletproofs+ and the related proofs show the transaction balances, without printing the number.",
    seal: ["amount"],
    meta: [["Hides", "Amount"], ["Fee", "0.01 PDC"]]
  },
  {
    id: "asset",
    n: "04",
    name: "Confidential assets",
    hides: "asset",
    title: "The asset id is blinded too.",
    body: "A wallet transfer does not announce whether the output is native PDC or a token issued on the chain. Issuance, updates, mint, and burn are separate, explicit asset operations.",
    seal: ["asset"],
    meta: [["Hides", "Asset type"], ["Whitelist", "api.privacydatacoin.com"]]
  },
  {
    id: "stake",
    n: "05",
    name: "Zarcanum",
    hides: "stake",
    title: "Staking does not publish your balance.",
    body: "Hard fork 4, after height 100, is the Zarcanum proof of stake. Odds follow the coins you stake. The amount stays sealed. There is no premine and no separate minimum beyond the 10-block coinstake age.",
    seal: ["amount", "from"],
    meta: [["Hides", "Staked amount"], ["Starts", "PoS from height 0, Zarcanum after block 100"]]
  }
];
