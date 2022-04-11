import React from 'react';
import { Dialog as HeadlessDialog } from '@headlessui/react';

export const Dialog = ({ children, open, onClose }) => {
  return (
    <HeadlessDialog open={open} onClose={onClose}>
      <HeadlessDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-transparent mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </HeadlessDialog>
  );
};
