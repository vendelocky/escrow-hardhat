import { ethers } from 'ethers';
import EscrowContract from './artifacts/contracts/Escrow.sol/Escrow';

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  status,
  signer,
  setEscrows
}) {

  const getContractInstance = (contractAddress, providerOrSigner) => {
    const contract = new ethers.Contract(contractAddress, EscrowContract.abi, providerOrSigner);
    return contract;
  };

  async function handleApprove(address, signer) {
    const escrowContract = getContractInstance(address, signer);
    await approve(escrowContract, signer);
    setEscrows(escrowContract);
  }

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Contract </div>
          <div> {address} </div>
        </li>
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value (ETH) </div>
          <div> {value} </div>
        </li>
        {!status ? (
          <div
            className="button"
            id={address}
            onClick={(e) => {
              e.preventDefault();
              handleApprove(address, signer);
            }}
          >
            Approve
          </div>) : (
          <div className="complete">
            ✓ It's been approved!
          </div>
        )}
      </ul>
    </div>
  );
}

export default Escrow;
