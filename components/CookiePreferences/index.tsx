import React from 'react'

export const CookiePreferences = (props) => {

    return (
        <div className="component cookiepreferences small-12 columns" id="TopOfCookiePreferences">
            <div className="container cookie-preferences">
                <h2 id="cookie-consent">!Cookie Consent!</h2>
                <p>Manage your cookie preferences:</p>

                <form action="/privacy-policy" method="post">           
                    <div className="cookie-preferences__section">
                        <fieldset>
                            <legend><strong>Required cookies</strong></legend>
                            <p id="requiredIntro">Cookies required to continually improve your website experience</p>

                            <div className="cookie-preferences__choices">
                                <div className="cookie-preferences__choice">
                                    <input aria-describedby="requiredIntro" checked={true} className="customRadio" id="RequiredCookieIsAlwaysTrue" name="RequiredCookieIsAlwaysTrue" type="radio" value="True" /> <label htmlFor="RequiredCookieIsAlwaysTrue">Yes</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                        {/* This repeats for every child on the datasource, currently just 2 */}
                        <div className="cookie-preferences__section">
                            <fieldset>
                                <legend><strong>Advertising Cookies</strong></legend>
                                <p id="cookie_section0">Cookies used for advertising purposes</p>

                                <div className="cookie-preferences__choices">
                                    <div className="cookie-preferences__choice">
                                        <input aria-describedby="cookie_section0" className="customRadio" id="ChildItems_0__IsSelectedyes" name="ChildItems[0].IsSelected" type="radio" value="True" /> <label htmlFor="ChildItems_0__IsSelectedyes">Yes</label>
                                    </div>
                                    <div className="cookie-preferences__choice">
                                        <input aria-describedby="cookie_section0" className="customRadio" id="ChildItems_0__IsSelectedno" name="ChildItems[0].IsSelected" type="radio" value="False" /> <label htmlFor="ChildItems_0__IsSelectedno">No</label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <input type="submit" className="cta-secondary cookie-preferences__button" value="Submit your preferences" />
                </form>    
            </div>
        </div>
    )
}