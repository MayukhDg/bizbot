import BusinessDetailsComponent from '@/components/BusinessDetailsComponent';
import { getBusinessDetails } from '@/lib/actions/misc';
import React from 'react'

const BusinessPage = async({params}) => {
const {id} = params;
const business = await getBusinessDetails(id)
console.log(business)
    
    return (
    <div>
        <h1 className='text-2xl font-bold mb-4'>Business Details</h1>
        <BusinessDetailsComponent business={business} />
    </div>
  )
}

export default BusinessPage