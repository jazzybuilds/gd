import React from 'react';
import Document, { Main } from 'next/document';
import CustomHead from '../components/CustomHead';

// When Sitecore solution does not have personalization rules and when it does not require SPA-navigation
// it makes sense to disable all nextjs scripts to minimize javascript bundle and fit performance budget.

// CustomDocument replaces stock.js Document component to replace stock Head component
export default class CustomDocument extends Document {
    render() {
        return (
            <html lang="en">
                {/* CustomHead replaces stock Next.js Head component to disable prefetching links */}
                <CustomHead />
                <body className="default-device">
                    <Main />
                </body>
            </html>
        );
    }
}
