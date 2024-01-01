const Message = ( {message} ) => {
	if (message === null)
		return null

	const firstWord = message.split(' ')[0]

	const messageStyle = {
		color: firstWord === 'Added' ? 'green' : 'red',
		background: 'lightgrey',
		fontSize: 20,
		borderStyle: 'solid',
		borderRadius: 5,
		padding: 10,
		marginBottom: 10
	}
	return (
		<div style={messageStyle}>
			{message}
		</div>
	)
}

export default Message