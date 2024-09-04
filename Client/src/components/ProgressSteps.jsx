import React from "react";
import { IoCheckboxOutline } from "react-icons/io5";

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
        <span className="ml-2">Login</span>
        <div className="mt-2 ml-4 text-lg text-center">
          <IoCheckboxOutline className="bg-green-500 text-white" />
        </div>
      </div>
      {step2 && (
        <>
          {step1 && <div className="h-0.5 w-[10rem] bg-green-500"></div>}
          <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
            <span >Shipping</span>
            <div className="mt-2 ml-5 text-lg text-center">
              <IoCheckboxOutline className="bg-green-500 text-white" />
            </div>
          </div>
        </>
      )}
      <>
      {step1 && step2 && step3 ? (
        <div className="h-0.5 w-[10rem] bg-green-500"></div>

      ) : <></>}
      <div clasName={`${step3 ? 'text-green-500' : 'text-grey-300'}`}>
        <span className={`text-green-500 ${!step3 ? 'ml-[10rem] ' : ''}`}>Summary</span>
        {step1 && step2 && step3 && (<div className="mt-2 ml-5 text-lg text-center"><IoCheckboxOutline className="bg-green-500 text-white" /></div>)}
      </div>
      </>
    </div>
  );
};

export default ProgressSteps;
