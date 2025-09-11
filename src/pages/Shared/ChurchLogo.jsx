const ChurchLogo = ({ title }) => {
  return (
    <div className="church-logo">
      <i className="fas fa-church"></i>
      {title && <h2>{title}</h2>}
    </div>
  );
};

export default ChurchLogo;