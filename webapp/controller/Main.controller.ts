import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import StandardListItem from "sap/m/StandardListItem";
import JSONModel from "sap/ui/model/json/JSONModel";
import CustomData from "sap/ui/core/CustomData";

/**
 * @namespace de.marianzeis.controller
 */
export default class Main extends BaseController {
	public onInit(): void {
		const oData = {
			contactInfo: [
				{ title: "LinkedIn", type: "Navigation", link: "https://www.linkedin.com/in/marianzeis" },
				{ title: "GitHub", type: "Navigation", link: "https://github.com/marianfoo" },
				{ title: "Email", description: "marian@marianzeis.de", type: "Active", link: "mailto:marian@marianzeis.de" },
				{ title: "Bluesky", type: "Navigation", link: "https://bsky.app/profile/marian.marianzeis.de" },
				{ title: "Mastodon", type: "Navigation", link: "https://saptodon.org/@Mianbsp" }
			],
			experience: [
				{ title: "Deutschsprachige SAP-Anwendergruppe e.V. (DSAG)", description: "Sprecher DSAG AG UI-Technologien (Jan 2023 - Present)" },
				{ title: "IT Consulting Marian Zeis", description: "Independent SAP Developer (Jun 2022 - Present)" },
				{ title: "XL2 by Audi and Capgemini", description: "SAP Developer (Jan 2022 - May 2022)" },
				{ title: "Müller Service GmbH", description: "SAP ABAP and SAPUI5 Developer (Jul 2018 - Dec 2021)" }
			],
			projects: [
				{ title: "UI5 Spreadsheet Importer", type: "Navigation", description: "Easy Excel Upload for SAP UI5 Application", link: "https://spreadsheet-importer.com/" },
				{ title: "Devtoberfest Badge Checker", type: "Navigation", description: "This is a UI5 App and express backend to check the Devtoberfest 2023 Badge.", link: "https://github.com/marianfoo/devtoberfest2023-badgechecker" }
			],
			topSkills: [
				{ title: "UI5 Development" },
				{ title: "ABAP Development" }
			],
			blogPosts: [
				{ title: "Load Data from a Excel File in UI5 and display the data in a Table with this Open Source Component", date: "April 13, 2023", link: "https://blogs.sap.com/2023/04/13/load-data-from-a-excel-file-in-ui5-and-display-the-data-in-a-table-with-this-open-source-component/" },
				{ title: "Automating UI5 Testing with GitHub Actions and wdi5 in multiple scenarios", date: "April 5, 2023", link: "https://blogs.sap.com/2023/04/05/automating-ui5-testing-with-github-actions-and-wdi5-in-multiple-scenarios/" },
				{ title: "Create a UI5 custom library with versioning using a multi version namespace", date: "March 12, 2023", link: "https://blogs.sap.com/2023/03/12/create-a-ui5-custom-library-with-versioning-using-a-multi-version-namespace/" },
				{ title: "Simplifying Excel Upload in Fiori Elements: The Open Source and Easy-to-Use UI5 Custom Control", date: "February 17, 2023", link: "https://blogs.sap.com/2023/02/17/simplifying-excel-upload-in-fiori-elements-the-open-source-and-easy-to-use-ui5-custom-control/" },
				{ title: "Stay Up to Date with SAP News and Updates using the SAP RSS Feeds Generator", date: "December 27, 2022", link: "https://blogs.sap.com/2022/12/27/stay-up-to-date-with-sap-news-and-updates-using-the-sap-rss-feeds-generator/" },
				{ title: "Best of UI5 – The best place to find packages for the UI5 ecosystem", date: "May 23, 2022", link: "https://blogs.sap.com/2022/05/23/best-of-ui5-the-best-place-to-find-packages-for-the-ui5-ecosystem/" }
			],
			presentations: [
				{
					title: "DSAG Jahreskongress 2024",
					links: [
						{ text: "Präsentation", url: "https://github.com/marianfoo/marianfoo/raw/main/DSAG-JK-2024-Umfrage.pdf" },
						{ text: "Umfragedaten", url: "https://github.com/marianfoo/marianfoo/raw/main/umfrageergebnisse.csv" }
					]
				},
				{
					title: "SIT Munich 24 - UI5 Spreadsheet Importer",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/SITMUCUI5SpreadsheetImporter.pdf" }
					]
				},
				{
					title: "SIT Belgium 24 - UI5 Spreadsheet Importer",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/SITBelgium24UI5SpreadsheetImporter.pdf" }
					]
				},
				{
					title: "DSAG Open Source Webinar - UI5 Spreadsheet Importer",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/DSAGOpenSourceUI5SpreadsheetImporter.pdf" }
					]
				},
				{
					title: "reCAP 2024 - CAP Community - Best of CAPJS",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/reCAP_2024_bestofcap.pdf" },
						{ text: "Link", url: "https://bestofcapjs.org/#" }
					]
				},
				{
					title: "reCAP 2024 - Seamless Integration: Crafting the Perfect CAP+UI5 Development Environment",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/reCAP_2024_devenv.pdf" },
						{ text: "Link", url: "https://github.com/marianfoo/ui5con24-dev-env" }
					]
				},
				{
					title: "UI5con 2024 - Seamless Integration: Crafting the Perfect UI5 Development Environment",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/2024_UI5con_dev.pdf" },
						{ text: "Link", url: "https://github.com/marianfoo/ui5con24-dev-env" }
					]
				},
				{
					title: "UI5con 2024 - Results of a comprehensive survey on UI5 app usage in Production with @vobu (Volker Buzek)",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/ui5con-2024-survey.pdf" },
						{ text: "Raw Results", url: "https://github.com/marianfoo/marianfoo/raw/main/ui5con-2024.xlsx" }
					]
				},
				{
					title: "SAPInsider EMEA 2023 - Speed up your Development with Fiori Elements",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/ZeisMarian-SpeedUpWithFioriElements.pdf" }
					]
				},
				{
					title: "UI5con 2023 Excel Upload Component",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/blob/main/2023_UI5con_excelupload_component.pdf" },
						{ text: "Live Demo", url: "https://livedemo.spreadsheet-importer.com/" },
						{ text: "GitHub", url: "https://github.com/marianfoo/ui5-cc-spreadsheetimporter" },
						{ text: "Documentation", url: "https://spreadsheet-importer.com/" },
						{ text: "Example Apps", url: "https://github.com/marianfoo/ui5-cc-spreadsheetimporter/tree/main/examples/packages" },
						{ text: "Landing Page", url: "https://spreadsheet-importer.com/" }
					]
				},
				{
					title: "DSAG Technologietage 2023 UI5 ExcelUpload",
					links: [
						{ text: "Präsentation", url: "https://github.com/marianfoo/marianfoo/raw/main/DSAG-Technologietage_2023_UI5_Excel_Upload.pdf" }
					]
				},
				{
					title: "SAP Inside Track Belgium 2022",
					links: [
						{ text: "Presentation", url: "https://github.com/marianfoo/marianfoo/raw/main/SITBE%20Best%20of%20Open%20Source%20SAP%20Projects.pdf" },
						{ text: "SAP Open Source Projects Linklist", url: "SAP_OpenSource.md" },
						{ text: "Survey Data", url: "https://github.com/marianfoo/marianfoo/raw/main/Survey_State_of_Open_Source.xlsx" }
					]
				}
			],
			videos: [
				{ title: "My YouTube channel", link: "https://www.youtube.com/@marianzeis4687" },
				{ title: "UI5con HYBRID 2022: UI5 Community – Contributor Experiences (Panel Discussion)", link: "https://www.youtube.com/watch?v=KOsQt-arDzs" },
				{ title: "UI5con HYBRID 2022: UI5 Community – Best of UI5", link: "https://www.youtube.com/watch?v=pOE3NKO_gk4" },
				{ title: "UI5ers live #18: Showcase Best Of UI5", link: "https://www.youtube.com/watch?v=vYd0-wzcZrU&t=368s" },
				{ title: "UI5ers live ##11: Barcode Scanner -> showing a Real World Example with SAPUI5 Barcode Scanner App", link: "https://www.youtube.com/watch?v=ksx7zhp_kkI&t=514s" }
			]
		};

		const oModel = new JSONModel(oData);
		this.getView().setModel(oModel, "profileData");
		
		// Add event delegation for click handling
		this.getView().addEventDelegate({
			onAfterRendering: () => {
				this.setupClickHandlers();
			}
		});
	}
	
	private setupClickHandlers(): void {
		// Get all clickable list items and add click handlers
		const clickableItems = document.querySelectorAll(".clickableItem");
		clickableItems.forEach(item => {
			item.addEventListener("click", event => {
				// Find the link and click it if the click wasn't directly on the link
				const target = event.target as HTMLElement;
				if (!target.closest("a")) {
					const link = item.querySelector("a");
					if (link) {
						link.click();
					}
				}
			});
		});
	}

	public sayHello(): void {
		MessageBox.show("Hello World!");
	}

	public onNavigateToImpressum(): void {
		const router = this.getRouter();
		router.navTo("impressum", {}, false);
	}

	public onNavigateToProfile(event: Event): void {
		const source = event.getSource() as StandardListItem;
		const customData = source.getCustomData()[0] as CustomData;
		const url = customData.getValue();
		if (url) {
			window.open(url, "_blank");
		} else {
			MessageBox.error("No URL provided for this profile.");
		}
	}

	public onSendEmail(): void {
		const email = "marian@marianzeis.de";
		const subject = "Contact from Website";
		const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
		window.location.href = mailtoLink;
	}
}
