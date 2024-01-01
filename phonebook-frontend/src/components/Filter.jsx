const Filter = ({ filterName, handleFilterName }) => (
	<div>
	  filter show with <input 
						value={filterName}
						onChange = {handleFilterName}  
					  />
	</div>
)

export default Filter