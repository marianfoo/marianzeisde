import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import { NavType } from "sap/ui/core/routing/History";
import Event from "sap/ui/base/Event";
import StandardListItem from "sap/m/StandardListItem";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace de.marianzeis.controller
 */
export default class Main extends BaseController {
	public onInit(): void {
		const oData = {
			contactInfo: [
				{ title: "LinkedIn", type: "Navigation", link: "https://www.linkedin.com/in/marianzeis" },
				{ title: "GitHub", type: "Navigation", link: "https://github.com/marianfoo" },
				{ title: "Email", description: "marian@marianzeis.de", type: "Active", press: "onSendEmail" },
				{ title: "Twitter", type: "Navigation", link: "https://twitter.com/mianbsp" }
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
			]
		};

		const oModel = new JSONModel(oData);
		this.getView().setModel(oModel, "profileData");
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
		const url = source.getCustomData()[0].mProperties["value"] as string;
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
