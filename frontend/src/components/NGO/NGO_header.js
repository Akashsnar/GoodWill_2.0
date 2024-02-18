import React from 'react'


function NGOHeader({ props }) {
    return (
        <div>
          <section class="page-header" style={{backgroundImage: `url(${props.bgimage})`}}>
  <div class="container">
      <div class="page-header__inner">
          <h2>{props.heading}</h2>
          <ul class="thm-breadcrumb list-unstyled">
              <li>Home</li>
              <li><span>/</span></li>
              <li>{props.page}</li>
              
          </ul>
      </div>
  </div>
</section>
</div>
    )
}
export default NGOHeader
