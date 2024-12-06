import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
  const [escrows, setEscrows] = useState(() => {
    const savedEscrows = localStorage.getItem('escrow');
    return savedEscrows ? JSON.parse(savedEscrows) : [];
  });
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    localStorage.setItem('escrow', JSON.stringify(escrows));
  }, [escrows]);

  const updateEscrow = (escrowContract) => {
    setEscrows((prevEscrows) =>
      prevEscrows.map((escrow) =>
        escrow.address === escrowContract.address ? { ...escrow, status: true } : escrow
      )
    );
  }

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = document.getElementById('eth').value;
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    console.log(escrowContract.address);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      status: false
    };
    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      {escrows.length > 0 && (
        <div className="existing-contracts">
          <h1> Existing Contracts </h1>
          <div id="container">
            {escrows.map((escrow) => {
              return (
                <Escrow 
                  key={escrow.address}
                  signer={signer}
                  setEscrows={updateEscrow}
                  {...escrow}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
