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
		// Prepare empty model
		const oModel = new JSONModel({
			contactInfo: [],
			experience: [],
			projects: [],
			topSkills: [],
			blogPosts: [],
			presentations: [],
			videos: []
		});
		this.getView().setModel(oModel, "profileData");
		
		// Load all data from JSON files
		this.loadAllData();
		
		// Add event delegation for click handling
		this.getView().addEventDelegate({
			onAfterRendering: () => {
				this.setupClickHandlers();
			}
		});
	}
	
	private loadAllData(): void {
		const model = this.getView().getModel("profileData") as JSONModel;
		
		// Load each data file
		this.loadJsonFile("contactInfo", model);
		this.loadJsonFile("experience", model);
		this.loadJsonFile("projects", model);
		this.loadJsonFile("topSkills", model);
		this.loadJsonFile("blogPosts", model);
		this.loadJsonFile("presentations", model);
		this.loadJsonFile("videos", model);
	}
	
	private loadJsonFile(dataName: string, model: JSONModel): void {
		const path = `./data/${dataName}.json`;
		
		// Use fetch API instead of jQuery.ajax
		fetch(path)
			.then(response => response.json())
			.then(data => {
				// Update the model with the loaded data
				model.setProperty(`/${dataName}`, data);
			})
			.catch(error => {
				console.error(`Error loading ${dataName}:`, error);
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

	public onNavigateToImpressum(): void {
		const router = this.getRouter();
		router.navTo("impressum", {}, false);
	}

	public onNavigateToProfile(event: Event): void {
		const source = event.getSource() as StandardListItem;
		const customData = source.getCustomData()[0] as CustomData;
		const url = customData.getValue() as string;
		if (url) {
			window.open(url, "_blank");
		} else {
			MessageBox.error("No URL provided for this profile.");
		}
	}

	public onSendEmail(): void {
		const email = "marian@zeis.de";
		const subject = "Contact from Website";
		const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
		window.location.href = mailtoLink;
	}
}
