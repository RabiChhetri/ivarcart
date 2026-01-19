


'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bike, User, UserCog } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const roles = [
  { id: 'admin', label: 'Admin', icon: UserCog },
  { id: 'user', label: 'User', icon: User },
  { id: 'deliveryBoy', label: 'Delivery Boy', icon: Bike },
]

function EditRoleMobile() {
  const [selectedRole, setSelectedRole] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const {update} = useSession()

  const router = useRouter()

  const handleEdit = async () => {
    if (!selectedRole || mobile.length !== 10) return

    try {
      setLoading(true)

      await axios.post('/api/user/edit-role-mobile', {
        role: selectedRole,
        mobile,
      })
      await update({role:selectedRole})

      router.push('/')
    } catch (error) {
      console.error(error)
      alert('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 w-full">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>

      {/* Role Cards */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = selectedRole === role.id

          return (
            <motion.div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              whileTap={{ scale: 0.94 }}
              className={`cursor-pointer flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all
                ${
                  isSelected
                    ? 'border-green-600 bg-green-100 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-green-400'
                }`}
            >
              <Icon size={36} className="text-green-700 mb-2" />
              <span className="font-semibold">{role.label}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Mobile Input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col items-center mt-10"
      >
        <label
          htmlFor="mobile"
          className="text-gray-700 font-medium mb-2"
        >
          Enter Your Mobile Number
        </label>

        <input
          type="tel"
          id="mobile"
          maxLength={10}
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
          placeholder="9841327882"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, ''))
          }
        />
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        disabled={mobile.length !== 10 || !selectedRole || loading}
        onClick={handleEdit}
        className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-10 ${
          mobile.length === 10 && selectedRole && !loading
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? 'Please wait...' : 'Go to Home'}
        {!loading && <ArrowRight />}
      </motion.button>
    </div>
  )
}

export default EditRoleMobile