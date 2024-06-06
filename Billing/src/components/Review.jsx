function Memorable() {
    return (
        <div className="p-8 md:p-20 flex">
            <div className="w-1/4">
                {/* Navigation Bar */}
                <nav className=" h-screen">
                    {/* Add your navigation links here */}
                   
                </nav>
            </div>
            <div className="w-3/4">
                <div className="text-center ">
                    <p className="text-5xl font-bold mt-4">Happy Customers</p>
                    <p className="mt-4 md:mt-8">
                        Happy diners, happy hearts! Join the delighted ranks of our satisfied customers and experience culinary excellence like never before.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    {/* Testimonial cards */}
                    <div className="text-left border border-black p-4 rounded-lg">
                        <p className='mt-5'>An absolute gem! The food was exquisite, service impeccable, and ambiance delightful. Can't wait to return!</p>
                        <div className='flex justify-between mt-10'>
                            <div>
                                <p className='text-lg font-bold'>Karyn Deely</p>
                                <p>Jan 20, 2024</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-left border border-black p-4 rounded-lg">
                        <p className='mt-5'>An absolute gem! The food was exquisite, service impeccable, and ambiance delightful. Can't wait to return!</p>
                        <div className='flex justify-between mt-10'>
                            <div>
                                <p className='text-lg font-bold'>Karyn Deely</p>
                                <p>Jan 20, 2024</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-left border border-black p-4 rounded-lg">
                        <p className='mt-5'>An absolute gem! The food was exquisite, service impeccable, and ambiance delightful. Can't wait to return!</p>
                        <div className='flex justify-between mt-10'>
                            <div>
                                <p className='text-lg font-bold'>Karyn Deely</p>
                                <p>Jan 20, 2024</p>
                            </div>
                        </div>
                    </div>
                    {/* Add more testimonials as needed */}
                </div>
            </div>
        </div>
    )
}

export default Memorable
