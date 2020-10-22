import React from 'react'

export const Accordion = (props) => {
  const { renderingContext } = props
  const { item: { children } } = renderingContext

  return (
    <div className="component accordion small-12 columns" data-properties="{&quot;expandOnHover&quot;:false,&quot;expandedByDefault&quot;:false,&quot;speed&quot;:500,&quot;easing&quot;:&quot;swing&quot;,&quot;canOpenMultiple&quot;:true,&quot;canToggle&quot;:true,&quot;isControlEditable&quot;:false}">
      <div className="component-content">
        <div>
          <ul className="items">
            {children.map((listItem, index) => (
              <li className="item" key={`accordion-${index}`}>
                <button type="button" className="toggle-header js-accordionToggle" aria-expanded="true" aria-controls={`section${index}`} id={`toggle${index}`} data-tabindex={index}>
                  <span className="label">
                    <div className="component content small-12 columns">
                      <div className="component-content">
                        <div className="field-heading" dangerouslySetInnerHTML={{ __html: listItem.fields.heading }} />
                      </div>
                    </div>
                  </span>
                </button>
                <div className="toggle-content js-accordionContent" id={`section${index}`} aria-labelledby={`toggle${index}`} aria-hidden="false">
                  <div className="component content small-12 columns">
                    <div className="component-content">
                      <div className="field-content" dangerouslySetInnerHTML={{ __html: listItem.fields.content }} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}