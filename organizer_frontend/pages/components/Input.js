import React from 'react';

export default function Input({ children, className, primary, ...props }) {
  const classes = primary
    ? 'hover:bg-blue-400 bg-blue-600 p-2 rounded-lg text-white bold shadow-lg border-2 border-blue-600 shadow-lg '
    : 'hover:bg-blue-600 bg-white border-2 border-blue-600 p-2 rounded-lg hover:text-white text-blue-600 bold shadow-lg transition-all duration-200 ';
  return (
    <div> <span className="input-desc"> {children} </span> <input className={classes + className} {...props} ></input> </div>
  );
}