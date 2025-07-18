'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const features = [
  {
    title: 'Global Reach',
    description: 'Book hotels anywhere in the world with ease.',
    icon: '🌍',
  },
  {
    title: 'Best Price Guarantee',
    description: 'Find the lowest prices across all platforms.',
    icon: '💰',
  },
  {
    title: '24/7 Support',
    description: 'We’re here to help anytime, day or night.',
    icon: '🕑',
  },
]

const HomeComponent = () => {
    const router = useRouter()
    return (
    <div className="text-gray-900">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center -mx-[2.1%] -mt-[7%]"
        style={{
          backgroundImage: 'url(https://source.unsplash.com/1920x1080/?luxury,hotel)',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-white text-5xl md:text-6xl font-bold"
          >
            Your Dream Stay Awaits
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-lg md:text-xl mt-4 max-w-2xl"
          >
            Discover and book the world’s best hotels at unbeatable prices.
          </motion.p>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hover:cursor-pointer mt-8 px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform"
            onClick={() => router.push('/login')}
          >
            Get Started
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-center mb-10"
          >
            Why Book with Us?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
              >
                <div className="text-4xl mb-4 text-blue-600">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <motion.h2
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6"
          >
            Ready to explore?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 mb-8"
          >
            Browse thousands of hotels worldwide and book your next adventure with confidence.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover:cursor-pointer px-12 py-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition"
            onClick={() => router.push('/booking')}
          >
            Start Booking
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default HomeComponent