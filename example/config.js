import dgKit from "daily-game-kit";

export const { storage, daily, updateExportData } = dgKit({
	name: "Example Game",
	namespace: "example",
	storedFields: {
		someSetting: {
            defaultValue: false,
            // The following settings are optional:
            exportTransform(value) {
                // Use this to change how the variable is serialised when exporting — this is useful if the naive JSON serialisation would be needlessly verbose
                return value ? "y" : "n";
            },
            importTransform(str) {
                // If you have set exportTransform, you should set importTransform to a function that reverses it.
                return str == "y";
            },
            exclude: false // if true, don't include this in data exports
        },
	},
	// launchDate: "2024-12-26",
	launchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().substring(0, 10),
	skipDates: []
});
