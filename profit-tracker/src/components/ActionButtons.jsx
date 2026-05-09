function ActionButtons({ clearInputDetails, discardReceipt }) {
  return (
    <div className="flex justify-center flex-col gap-2">
      <button
        className="w-full p-4 border border-gray-300 rounded-md mb-4 bg-green-400 text-white font-medium cursor-pointer hover:bg-green-500 transition"
        onClick={clearInputDetails}
      >
        Add
      </button>

      <button className="text-red-600" onClick={discardReceipt}>
        Discard
      </button>
    </div>
  );
}

export default ActionButtons;
