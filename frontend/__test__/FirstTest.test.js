import { render, screen } from '@testing-library/react'
import FirstTest from '../src/components/Products/Productitems';
// import { render, screen } from '@testing-library/react'; import App from './App';

// describe('<FirstTest/>', ()=>{ 
describe('<FirstTest/>', () => {
it('should display the title of the app page', ()=>{
render(<FirstTest/>)
expect(screen.getByText('Food')).toBeInTheDocument()
})
// it('should display the four buttons on the page', ()=>{ clear
// render(<FirstTest/>)
// expect(screen.getAllByTestId('btn-list')).toHaveLength(4)
// })
})