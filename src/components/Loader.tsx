import PropagateLoader from "react-spinners/PropagateLoader";
import RingLoader from "react-spinners/RingLoader";
import PuffLoader from "react-spinners/PuffLoader";

export const Loader = () => {
  return (
    <>
      <div className="position-fixed top-50 start-50 translate-middle">
        <p className=" text-center">
          <PropagateLoader
            color="#41323d"
            loading
            size={26}
            speedMultiplier={1.2}
          />{" "}
        </p>
        <h3 className="tex-center ms-5 mt-5 text-bg-white">Loading ... </h3>
      </div>
    </>
  );
};

export const RingLoaders = () => {
  return (
    <>
      <div className="position-fixed top-50 start-50 translate-middle">
        <p className=" text-center ms-5">
          <RingLoader
            color="#"
            loading
            size={50}
            speedMultiplier={1.2}
          />{" "}
        </p>
        <h3 className="tex-center ms-3 mt-3 text-bg-white">Loading ... </h3>
      </div>
    </>
  );
};

export const DotLoaders = () => {
  return (
    <>
      <div className="position-fixed top-50 start-50 translate-middle">
        <p className=" text-center ms-5">
          <PuffLoader
            color="black"
            loading
            size={50}
            speedMultiplier={1.2}
          />{" "}
        </p>
        <h3 className="tex-center ms-3 mt-3 text-bg-white">Loading ... </h3>
      </div>
    </>
  );
};
