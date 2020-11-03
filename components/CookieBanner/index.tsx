import React from 'react'

export const CookieBanner = (props) => {
  React.useEffect(() => {
    console.log('thy has rendered')
  },[])

  return (
    <div className="privacy-warning permisive" >
      <div className="info">
        <p><span>We use necessary cookies to make our site work and give you the best possible experience. You can choose not to allow some types of cookies but this might affect how the website works. We would like to set optional analytics and advertising cookies to help us improve and customise your browsing experience; for analytics and metrics; and to allow Guide Dogs and our advertising partners to provide you with messages tailored to your interests.  We won’t set optional cookies unless you enable them.  For more information about the cookies we use, please see our <a href="/privacy-policy">Privacy Policy</a>. </span></p>
      </div>
      <div className="controls">
        <div className="submit">
          <button
            onClick={function(){
              console.log('thy has accepted')
            }}
            aria-label="Accept use of cookies">Accept</button>
        </div>

        <div className="submit" style={{ paddingLeft: '15px' }}>
          <button>Manage preferences</button>
        </div>

        <div className="submit REJECT CLASS" style={{ paddingLeft: '15px' }}>
          <button
          onClick={function(){
              console.log('thy has rejected')
            }}
            aria-label="Reject use of cookies">Reject</button>
        </div>
      </div>
    </div>
  )
}