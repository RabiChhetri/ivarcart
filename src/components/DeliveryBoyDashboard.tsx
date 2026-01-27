'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { RootState } from '@/redux/store'
import { getSocket } from '@/lib/socket'
import LiveMap from './LiveMap'

interface ILocation{
    latitude:number,
    longitude:number
}
function DeliveryBoyDashboard() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [userLocation,setUserLocation]=useState<ILocation>(
    {
        latitude:0,
        longitude:0
    }
)
const [deliveryBoyLocation,setDeliveryBoyLocation]=useState<ILocation>(
     {
        latitude:0,
        longitude:0
    }
)
  const { userData } = useSelector((state: RootState) => state.user)

  // Fetch delivery assignments
  const fetchAssignments = async () => {
    try {
      const result = await axios.get('/api/deliver/get-assignment')
      setAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch current active order
  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get('/api/deliver/current-order')
      if (result.data?.assignment) {
        setActiveOrder(result.data.assignment)
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Handle accepting an assignment
  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(`/api/deliver/assignment/${id}/accept-assignment`)
      if (result.data?.active && result.data.assignment) {
        setActiveOrder(result.data.assignment)
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    const socket=getSocket()
    if(!userData?._id) return
        if(!navigator.geolocation) return
           const watcher=navigator.geolocation.watchPosition((pos)=>{
                const lat=pos.coords.latitude
                const lon=pos.coords.longitude
                setDeliveryBoyLocation({
                    latitude:lat,
                    longitude:lon
                })
                socket.emit("update-location",{userId:userData?._id,latitude:lat,longitude:lon})
            },(err)=>{
                console.log(err)
            },{enableHighAccuracy:true})
            return ()=>navigator.geolocation.clearWatch(watcher)
  },[userData?._id])

  // Socket connection for new assignments
  useEffect(() => {
    const socket = getSocket()
    socket.on('new-assignment', (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment])
    })
    return () => {
      socket.off('new-assignment')
    }
  }, [])

  // Fetch assignments and current order when userData changes
  useEffect(() => {
    if (userData) {
      fetchAssignments()
      fetchCurrentOrder()
    }
  }, [userData])

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {activeOrder && userLocation ? (
          <div className="p-4 pt-[130px] bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-green-700 mb-2">Active Delivery</h1>
            <p className='text-gray-600 text-sm mb-4'>order#{activeOrder.order._id.slice(-6)}</p>
            
            <div className='rounded-xl border shadow-lg overflow-hidden mb-6'>
                <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mt-[120px] mb-[30px]">Delivery Assignments</h2>
            {assignments.length > 0 ? (
              assignments.map((a) => (
                <div key={a._id} className="p-5 bg-white rounded-xl mb-4 border">
                  <p>
                    <b>Order Id:</b> #{a?.order?._id?.slice(-6)}
                  </p>
                  <p className="text-gray-600">{a.order.address.fullAddress}</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                      onClick={() => handleAccept(a._id)}
                    >
                      Accept
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">Reject</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No delivery assignments available.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DeliveryBoyDashboard
