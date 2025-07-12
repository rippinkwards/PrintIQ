import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { publicApi } from '../utils/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await publicApi.submitContact(data);
      setIsSubmitted(true);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "hello@artistportfolio.com",
      description: "Send me a message anytime"
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "24-48 hours",
      description: "I'll get back to you quickly"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Digital Studio",
      description: "Working remotely worldwide"
    }
  ];

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <section className="section bg-gradient-primary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-primary-600">
              Have a question about my artwork? Want to commission a custom piece? 
              I'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-primary-900 mb-4">
                  Let's Connect
                </h2>
                <p className="text-primary-600 leading-relaxed">
                  Whether you have questions about existing artwork, want to discuss a custom commission, 
                  or just want to say hello, I'm here to help.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-900 mb-1">{info.title}</h3>
                      <p className="text-accent-600 font-medium mb-1">{info.details}</p>
                      <p className="text-sm text-primary-600">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <div className="bg-primary-50 rounded-xl p-6">
                <h3 className="font-semibold text-primary-900 mb-4">Quick Answers</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-primary-800">Do you offer custom commissions?</p>
                    <p className="text-primary-600">Yes! I love creating custom pieces tailored to your vision.</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary-800">What file formats do you provide?</p>
                    <p className="text-primary-600">High-resolution JPEG and PNG files, perfect for printing.</p>
                  </div>
                  <div>
                    <p className="font-medium text-primary-800">Can I use your art commercially?</p>
                    <p className="text-primary-600">Standard license is for personal use. Commercial licenses available upon request.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-primary-900 mb-2">Message Sent!</h3>
                    <p className="text-primary-600">
                      Thank you for reaching out. I'll get back to you within 24-48 hours.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-primary-900 mb-2">Send me a message</h2>
                      <p className="text-primary-600">
                        Fill out the form below and I'll respond as soon as possible.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            id="name"
                            placeholder=" "
                            className={`input ${errors.name ? 'border-red-500' : ''}`}
                            {...register('name', { required: 'Name is required' })}
                          />
                          <label htmlFor="name">Your Name</label>
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>

                        <div className="form-floating">
                          <input
                            type="email"
                            id="email"
                            placeholder=" "
                            className={`input ${errors.email ? 'border-red-500' : ''}`}
                            {...register('email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email address'
                              }
                            })}
                          />
                          <label htmlFor="email">Email Address</label>
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="form-floating">
                        <textarea
                          id="message"
                          rows="6"
                          placeholder=" "
                          className={`textarea ${errors.message ? 'border-red-500' : ''}`}
                          {...register('message', { 
                            required: 'Message is required',
                            minLength: {
                              value: 10,
                              message: 'Message must be at least 10 characters'
                            }
                          })}
                        ></textarea>
                        <label htmlFor="message">Your Message</label>
                        {errors.message && (
                          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full inline-flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section bg-primary-900 text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-primary-300 mb-8">
              Subscribe to get updates on new artwork, special offers, and behind-the-scenes content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="btn bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;