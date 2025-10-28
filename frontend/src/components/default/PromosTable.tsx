import EditableCell from "./EditableCell";

export default function PromosTable({ promos, onUpdate, onDelete }) {
  const columns = ["promo_id", "promo_code", "discount", "expiration_date"];

  return (
    <div className="overflow-x-auto border">
      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-black">
          <tr>
            <th className="text-left p-3 font-semibold text-white border-b w-12"></th>
            {columns.map((col) => (
              <th
                key={col}
                className="text-left p-3 font-semibold text-white border-b capitalize"
              >
                {col.replaceAll("_", " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {promos.map((promo) => (
            <tr key={promo.promo_id} className="hover:bg-gray-50/50">
              <td className="p-3 border-b bg-white/10">
                <button
                  onClick={() => onDelete(promo.promo_id)}
                  className="cursor-pointer hover:text-red-600"
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </td>
              {columns.map((col) => (
                <EditableCell
                  key={col}
                  value={promo[col]}
                  onChange={(val) => onUpdate(promo.promo_id, col, val)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
