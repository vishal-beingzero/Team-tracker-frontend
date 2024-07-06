import PropagateLoader from "react-spinners/PropagateLoader";

export const Loader = () => {
  return (
    <>
      <div className="position-fixed top-50 start-50 translate-middle">
        <p className=" text-center">
          <PropagateLoader
            color="#41323d"
            loading
            size={30}
            speedMultiplier={1}
          />{" "}
        </p>
        <h3 className="tex-center ms-5 mt-5 text-bg-white">Loading ... </h3>
      </div>
    </>
  );
};
