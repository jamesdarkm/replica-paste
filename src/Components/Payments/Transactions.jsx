import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { doc, collection, getDocs } from 'firebase/firestore';
import { Navigate, useNavigate, Link } from 'react-router-dom';

const Transactions = ({ isOpen, onClose, uid, ownerId }) => {
    if (!isOpen) return null;
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function getTransactions() {
            const transactionsRef = collection(db, 'transactions');
            const data = await getDocs(transactionsRef);
            const transactionsArray = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter transactions by ownerId
            const filteredTransactions = transactionsArray.filter(transaction => transaction.ownerId === ownerId);
            setTransactions(filteredTransactions);
        }

        getTransactions();
    }, [ownerId]);

    return (
        <>
            <div className='relative z-10'>
                <div className='fixed inset-0 bg-gray-900 bg-opacity-75' />

                <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                    <div className='flex min-h-full items-end justify-center p-4 text-center items-center'>
                        <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl my-8 w-full max-w-lg'>
                            <div className='bg-white p-6'>
                                <div>
                                    <div className='flex items-center justify-between pb-3  border-solid border-b-2 border-slate-200 '>
                                        <div className='text-base font-semibold leading-6 text-gray-900'>
                                            Billing history
                                        </div>

                                        <button
                                            className='flex items-center justify-center'
                                            onClick={onClose}
                                        >
                                            <ion-icon
                                                size='large'
                                                name='close-outline'
                                            ></ion-icon>
                                        </button>
                                    </div>
                                    <div className='mt-7'>
                                        {transactions && transactions.length > 0 ? (
                                            <>
                                                {transactions
                                                    .filter(transaction => transaction.ownerId === ownerId)
                                                    .map((transaction) => (
                                                        <div key={transaction.id} className='mt-5 grid grid-cols-3 gap-4'>
                                                            <div>{transaction.billing_date}</div>
                                                            <div>R{transaction.amount_gross}</div>
                                                            <Link
                                                                to={`/invoice/${transaction.id}`}
                                                                className='text-right'
                                                                target="_blank"
                                                            >
                                                                Download
                                                            </Link>
                                                        </div>
                                                    ))}
                                            </>
                                        ) : (
                                            <div>No transactions</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Transactions;