import React from 'react'

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { metaObject } from '@/config/site.config';
import CommunitiesGrid from './_components/communities-table';

export const metadata = {
  ...metaObject("Communities | Home"),
};


export default function Communities() {
  return (
    <CommunitiesGrid/>
  )
}
