const BioBuddy = ({ size = 'w-40' }) => {
  return (
    <img
      src="/biobuddy.png"
      alt="BioBuddy el personaje"
      className={`${size} drop-shadow-xl animate-bounce`}
    />
  );
};

export default BioBuddy;