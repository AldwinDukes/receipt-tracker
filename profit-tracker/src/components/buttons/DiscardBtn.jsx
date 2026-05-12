import { Link } from "react-router-dom";

function DiscardBtn({ btnAction }) {
  return (
    <Link to="/UploadPage">
      <button
        onClick={btnAction}
        className="p-4 text-red-600 hover:cursor-pointer w-full"
      >
        Discard
      </button>
    </Link>
  );
}

export default DiscardBtn;
