import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; // 1. Import Secure Hook
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FaLock, FaShieldAlt, FaCheckCircle, FaCopy } from "react-icons/fa";

const CheckoutForm = ({ price, parcelId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure(); // 2. Initialize
    
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState("");

    // Fetch Payment Intent
    useEffect(() => {
        if (price > 0) {
            // Using axiosSecure handles baseURL and JWT headers automatically
            axiosSecure.post("/create-payment-intent", { price })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error("Payment Intent Error:", err);
                    setCardError("Failed to initialize payment. Please refresh.");
                });
        }
    }, [price, axiosSecure]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        const card = elements.getElement(CardNumberElement);
        if (card == null) return;

        setProcessing(true);
        setCardError("");

        // 3. Confirm Payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous',
                },
            },
        });

        if (error) {
            setCardError(error.message);
            setProcessing(false);
        } else {
            if (paymentIntent.status === "succeeded") {
                const payment = {
                    email: user?.email,
                    transactionId: paymentIntent.id,
                    price,
                    date: new Date(), // Consider using server-side timestamps in production
                    parcelId: parcelId,
                    status: 'Paid'
                };

                try {
                    // 4. Save payment using axiosSecure
                    const res = await axiosSecure.post('/payments', payment);
                    
                    if (res.data?.paymentResult?.insertedId || res.data?.success) {
                        Swal.fire({
                            title: "Payment Success!",
                            html: `Transaction ID: <br/><small className="font-mono text-lime-600">${paymentIntent.id}</small>`,
                            icon: "success",
                            confirmButtonColor: '#a3e635',
                        });
                        navigate("/dashboard/myParcels"); 
                    }
                } catch (dbError) {
                    console.error("DB Update Error:", dbError);
                    setCardError("Payment succeeded but database update failed. Please contact support.");
                }
            }
            setProcessing(false);
        }
    };

    const elementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#ffffff',
                fontFamily: '"Inter", sans-serif',
                '::placeholder': { color: '#64748b' },
            },
            invalid: { color: '#f87171', iconColor: '#f87171' },
        },
    };

    return (
        <div className="max-w-md mx-auto bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
            {/* Header */}
            <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Checkout</h2>
                        <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">Secure Stripe Gateway</p>
                    </div>
                    <div className="bg-lime-400 p-3 rounded-2xl shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                        <FaShieldAlt className="text-slate-900 text-xl" />
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm font-medium">Payable Amount</span>
                        <span className="text-3xl font-black text-lime-400">{price} <span className="text-sm">TK</span></span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                <div className="space-y-4">
                    {/* Card Number Input */}
                    <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-2 block tracking-widest group-focus-within:text-lime-400 transition-colors">Card Number</label>
                        <div className="p-4 border border-slate-700 rounded-2xl bg-slate-800/30 focus-within:border-lime-400/50 focus-within:bg-slate-800/60 transition-all">
                            <CardNumberElement options={elementOptions} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Expiry */}
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-2 block tracking-widest">Expiry Date</label>
                            <div className="p-4 border border-slate-700 rounded-2xl bg-slate-800/30 focus-within:border-lime-400/50 transition-all">
                                <CardExpiryElement options={elementOptions} />
                            </div>
                        </div>
                        {/* CVC */}
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-2 block tracking-widest">CVC Code</label>
                            <div className="p-4 border border-slate-700 rounded-2xl bg-slate-800/30 focus-within:border-lime-400/50 transition-all">
                                <CardCvcElement options={elementOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {cardError && (
                    <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 p-4 rounded-2xl border border-red-400/20 animate-shake">
                        <span>{cardError}</span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!stripe || !clientSecret || processing}
                    className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-lime-400/10 disabled:shadow-none"
                >
                    {processing ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : (
                        <>
                            <FaLock className="text-sm" />
                            Confirm Payment
                        </>
                    )}
                </button>

                {/* Footer Security Badge */}
                <div className="flex justify-center items-center gap-3 py-2 border-t border-slate-800/50 mt-4">
                    <div className="flex items-center gap-1.5">
                        <FaCheckCircle className="text-lime-400 text-[10px]" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">PCI Compliant</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                    <div className="flex items-center gap-1.5">
                        <FaCheckCircle className="text-lime-400 text-[10px]" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">SSL Encrypted</span>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;