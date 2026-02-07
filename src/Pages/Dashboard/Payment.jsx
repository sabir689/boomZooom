import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, useParams } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

// Make sure your .env variable name matches exactly
const stripePromise = loadStripe(import.meta.env.VITE_payment_Key);

const Payment = () => {
    const { id } = useParams();
    const location = useLocation();
    const price = location.state?.price || 0;

    return (
        <div className="p-4 lg:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-black text-center mb-10 text-slate-900 tracking-tight">
                    Secure <span className="text-lime-500">Checkout</span>
                </h2>
                
                <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100">
                    {/* Invoice-style Header */}
                    <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Parcel Tracking ID</p>
                            <p className="text-lg font-mono text-lime-400">{id}</p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Total to Pay</p>
                            <p className="text-4xl font-black text-lime-400">{price} <span className="text-sm">TK</span></p>
                        </div>
                    </div>

                    <div className="p-10">
                        {price > 0 ? (
                            <Elements stripe={stripePromise}>
                                {/* Pass price and id to the form */}
                                <CheckoutForm price={price} parcelId={id} />
                            </Elements>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-red-500 font-bold text-xl">Invalid price amount.</p>
                                <p className="text-slate-400">Please go back to My Parcels and try again.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <p className="text-center mt-8 text-slate-400 text-sm font-medium">
                    Protected by Stripe. We do not store your card details.
                </p>
            </div>
        </div>
    );
};

export default Payment;