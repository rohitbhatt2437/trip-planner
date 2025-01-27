import { apiClient } from '@/lib/api-client'
import { ADMIN_API_ROUTES } from '@/utils'
import { Card, CardBody, CardHeader } from '@heroui/react'
import React, { useEffect, useState } from 'react'

const ScrapingQueue = () => {
    const [onGoingJobs, setOnGoingJobs] = useState(0)

    useEffect(()=>{
        const getData = async ()=>{
            const data = await apiClient.get(ADMIN_API_ROUTES.JOB_DETAILS);
            setOnGoingJobs(data.data.onGoingJobs)
        }

        const interval = setInterval(()=>getData(),3000 )

        return ()=>{
            clearInterval(interval)
        }
    }, [])
  return (
    <Card className='h-full' >
        <CardHeader>Current Queue</CardHeader>
        <CardBody></CardBody>
    </Card>
  )
}

export default ScrapingQueue