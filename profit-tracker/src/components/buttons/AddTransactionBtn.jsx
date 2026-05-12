import { Link } from "react-router-dom";

function AddTransactionBtn({ btnAction }) {
  return (
    <Link to="/UploadPage">
      <button
        onClick={btnAction}
        className="w-full p-4 border border-gray-300 rounded-md mb-4 bg-green-400 text-white font-medium cursor-pointer hover:bg-green-500 transition"
      >
        Add
      </button>
    </Link>
  );
}

export default AddTransactionBtn;
