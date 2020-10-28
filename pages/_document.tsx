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

                    <script src="https://www.guidedogs.org.uk/-/media/Base-Themes/Core-Libraries/scripts/optimized-min.js?t=20190703T145418Z"></script>
                    <script src="https://www.guidedogs.org.uk/-/media/Base-Themes/XA-API/Scripts/optimized-min.js?t=20190703T145419Z"></script>
                    <script src="https://www.guidedogs.org.uk/-/media/Base-Themes/Main-Theme/scripts/optimized-min.js?t=20190703T145420Z"></script>
                    <script src="https://www.guidedogs.org.uk/-/media/Base-Themes/Google-Maps-JS-Connector/Scripts/optimized-min.js?t=20190703T145421Z"></script>
                    <script src="https://www.guidedogs.org.uk/-/media/Base-Themes/Maps/Scripts/optimized-min.js?t=20190703T145421Z"></script>
                    <script src="https://www.guidedogs.org.uk/-/media/Base-Themes/SearchTheme/Scripts/optimized-min.js?t=20190703T145422Z"></script>
                    <script src="https://www.guidedogs.org.uk/-/media/Base-Themes/Components-Theme/Scripts/optimized-min.js?t=20200422T100700Z"></script>
                    <script src="https://www.guidedogs.org.uk/-/media/Base-Themes/Resolve-Conflicts/Scripts/optimized-min.js?t=20190703T145423Z"></script>
                    <script src="https://www.guidedogs.org.uk/-/media/Themes/GuideDogs/GuideDogsDotOrg/GuideDogsTheme/scripts/optimized-min.js?t=20200914T091538Z"></script>  

                </body>
            </html>
        );
    }
}
