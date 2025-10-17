import React from "react";

const TableSection = ({ tableData }) => (
  <div className="chart-container">
    <h3>Mpino isam-karite</h3>
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Kartie</th>
            <th>Effectif Mpino</th>
            <th>Pourcentage</th>
            {/* <th>Date</th> */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id}>
              <td>{item.karite}</td>
              <td>{item.isaMpino}</td>
              <td>{item.percentage} %</td>
              {/* <td>{item.daty }</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default TableSection;
