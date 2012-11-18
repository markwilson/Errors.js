# Basic JavaScript Error Handling

Usage:

    <script src="js/Errors.js"></script>
	<!-- Include your frameworks here -->
	<script>
		Errors.initialise({
			ajax: {
				url: '<your error handling url>',
				method: 'POST'
			},
			debugMode: true,
			customHandler: function (errorData) {
				console.log(errorData);
			}
		});
	</script>

NB: At least one of ajax, debugMode, and customHandler must be defined.