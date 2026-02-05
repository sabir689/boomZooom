import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, useParams } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_payment_Key);

const Payment = () => {
    const { id } = useParams();
    const location = useLocation();
    const price = location.state?.price || 0;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center mb-8 text-lime-400">Complete Payment</h2>
            
            <div className="bg-gray-400 shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
                    <div>
                        <p className="text-lime-400 text-sm uppercase tracking-widest">Parcel ID</p>
                        <p className="text-lg text-lime-400 font-mono">{id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lime-400 text-sm uppercase tracking-widest">Total Amount</p>
                        <p className="text-3xl text-lime-400 font-bold">{price} TK</p>
                    </div>
                </div>

                <div className="p-8">
                    {/* Only render Elements if price is valid */}
                    {price > 0 ? (
                        <Elements stripe={stripePromise}>
                            <CheckoutForm price={price} parcelId={id} />
                        </Elements>
                    ) : (
                        <p className="text-red-500 text-center">Invalid price amount.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;