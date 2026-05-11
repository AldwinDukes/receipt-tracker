//components
import ActionButtons from "./ActionButtons";
import { clearInputDetails } from "../utils/clearInputs";
import { discardReceipt } from "../utils/discardReceipt";

import { Link } from "react-router-dom";

function AddManually() {
  return (
    <>
      <div className="max-w-md flex flex-col gap-2 p-4">
        <h2 className="text-center">Add Manually</h2>
        {/* Add your form or input fields here */}
        <label htmlFor="receipt-type" className="sr-only">
          Receipt Type
        </label>
        <select
          id="receipt-type"
          className="block w-full text-sm text-slate-500 border border-gray-300 rounded-md p-2"
        >
          <option value="cash-in">Cash In</option>
          <option value="cash-out">Cash Out</option>
        </select>

        <label htmlFor="amount" className="sr-only">
          Amount
        </label>
        <input
          type="text"
          id="amount"
          className="block w-full text-sm text-slate-500 border border-gray-300 rounded-md p-2"
          placeholder="Amount"
        />

        <label htmlFor="reference-number" className="sr-only">
          Reference Number
        </label>
        <input
          type="text"
          id="reference-number"
          className="block w-full text-sm text-slate-500 border border-gray-300 rounded-md p-2"
          placeholder="Reference Number"
        />

        <label htmlFor="charge-amount" className="sr-only">
          Charge Amount
        </label>
        <input
          type="text"
          id="charge-amount"
          className="block w-full text-sm text-slate-500 border border-gray-300 rounded-md p-2"
          placeholder="Charge Amount"
        />
      </div>

      <Link to="/UploadPage">
        <ActionButtons
          clearInputDetails={clearInputDetails}
          discardReceipt={discardReceipt}
        />
      </Link>
    </>
  );
}

export default AddManually;
