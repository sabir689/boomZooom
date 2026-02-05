import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FaLock, FaCreditCard, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

const CheckoutForm = ({ price, parcelId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState("");

    useEffect(() => {
        if (price > 0) {
            axios.post("http://localhost:5000/create-payment-intent", { price })
                .then(res => setClientSecret(res.data.clientSecret))
                .catch(err => console.error("Error fetching intent:", err));
        }
    }, [price]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        const card = elements.getElement(CardNumberElement);
        if (card == null) return;

        setProcessing(true);
        setCardError("");

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
                    date: new Date(),
                    parcelId: parcelId,
                    status: 'Paid'
                };

                const res = await axios.post('http://localhost:5000/payments', payment);
                
                if (res.data.paymentResult.insertedId) {
                    Swal.fire({
                        title: "Payment Success!",
                        text: "Your parcel is now being processed.",
                        icon: "success",
                        confirmButtonColor: '#a3e635', // lime-400
                    });
                    navigate("/dashboard/myParcels"); 
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
                '::placeholder': { color: '#94a3b8' },
            },
            invalid: { color: '#f87171' },
        },
    };

    return (
        <div className="max-w-md mx-auto bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
            {/* Header Section */}
            <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Checkout</h2>
                        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Secure Encryption</p>
                    </div>
                    <div className="bg-lime-400 p-3 rounded-2xl shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                        <FaShieldAlt className="text-slate-900 text-xl" />
                    </div>
                </div>

                {/* Total Cost Display */}
                <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Payable Amount</span>
                        <span className="text-3xl font-black text-lime-400">{price} TK</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
                <div className="space-y-4">
                    {/* Card Number */}
                    <div className="group">
                        <label className="text-[10px] font-bold text-lime-400 uppercase ml-1 mb-1 block tracking-widest">Card Number</label>
                        <div className="p-4 border border-slate-700 rounded-xl bg-slate-800/50 focus-within:border-lime-400 transition-all">
                            <CardNumberElement options={elementOptions} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Expiry */}
                        <div>
                            <label className="text-[10px] font-bold text-lime-400 uppercase ml-1 mb-1 block tracking-widest">Expiry</label>
                            <div className="p-4 border border-slate-700 rounded-xl bg-slate-800/50 focus-within:border-lime-400 transition-all">
                                <CardExpiryElement options={elementOptions} />
                            </div>
                        </div>
                        {/* CVC */}
                        <div>
                            <label className="text-[10px] font-bold text-lime-400 uppercase ml-1 mb-1 block tracking-widest">CVC</label>
                            <div className="p-4 border border-slate-700 rounded-xl bg-slate-800/50 focus-within:border-lime-400 transition-all">
                                <CardCvcElement options={elementOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Logic */}
                {cardError && (
                    <div className="flex items-center gap-2 text-red-400 text-xs font-medium bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                        <span>{cardError}</span>
                    </div>
                )}

                {/* Pay Button */}
                <button
                    type="submit"
                    disabled={!stripe || !clientSecret || processing}
                    className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-slate-700 text-slate-900 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 shadow-[0_10px_20px_rgba(163,230,53,0.2)] disabled:shadow-none"
                >
                    {processing ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : (
                        <>
                            <FaLock className="text-sm" />
                            Pay Now
                        </>
                    )}
                </button>

                <div className="flex justify-center items-center gap-2 text-slate-500">
                    <FaCheckCircle className="text-lime-400 text-xs" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Verified Secure Transaction</span>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;