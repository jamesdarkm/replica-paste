import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../Context/authContext';


const Tests = () => {
    const [InvoicePreview, setInvoicePreview] = useState(null); // State to store the InvoicePreview component
    const { id } = useParams();

    const { currentUser } = useAuth();
    const uid = currentUser?.uid;

    console.log(currentUser)

    // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#fff',
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
        },
        image: {
            width: 150,
            height: 150,
        },
    });

    // Later save the PDF as a file, submit it via email and delete the generated file
    useEffect(() => {
        async function getTransactions() {
            const mainDocRef = doc(db, 'transactions', id);
            const docSnap = await getDoc(mainDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log(data.amount_fee);

                // Dynamically set the InvoicePreview component
                setInvoicePreview(() => () => (
                    <Document>
                        <Page size="A4" style={styles.page}>
                            <View style={styles.section}>
                                <Text>Billed to: {currentUser.additionalInformation.firstName} {currentUser.additionalInformation.lastName}</Text>
                                <Text>Plan: PRO</Text>
                                <Text>Status: {data.status}</Text>
                                <Text>Email: {data.email_address}</Text>
                                <Text>Paid on: {data.billing_date}</Text>
                                <Text>Amount: R {data.amount_gross}</Text>
                            </View>
                        </Page>
                    </Document>
                ));
            } else {
                console.log('No invoice exists');
            }
        }

        getTransactions();
    }, []); // Empty dependency array ensures this runs once when the component mounts




    return (
        <>
            {InvoicePreview ?
                <PDFViewer style={{ width: '100%', height: '100vh' }}>
                    <InvoicePreview />
                </PDFViewer>
                : <p>No invoice found</p>
            }
        </>
    );
};

export default Tests;