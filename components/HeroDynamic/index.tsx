import React from 'react'
import HeroSecondary from '../HeroSecondary'

const HeroDynamic = (props) => {
  const [name, setName] = React.useState<string>("")
  const { item: { fields } } = props.renderingContext

  React.useEffect(() => {
    if (localStorage.getItem('form-user-firstname')) {
      setName(localStorage.getItem('form-user-firstname'))
    }
  }, [])

  return (
    <React.Fragment>
      <HeroSecondary 
        renderingContext={{
          item: {
            fields: {
              herofocalpoint: fields["herofocalpoint"],
              heroimage: fields["hero image"],
              herotitle: fields["hero caption"].replace(fields["hero caption replacement field name"], name)
            }
          }
        }}
      />
    </React.Fragment>
  )
}

export default HeroDynamic