"use client";

import React, { use } from 'react';
import { SmartReorderPage } from '@/features/purchase';

const Page = ({ params }) => {
  const unwrappedParams = use(params);
  const { storeId } = unwrappedParams;
  
  return <SmartReorderPage storeId={storeId} />;
};

export default Page;
