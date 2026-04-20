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
	private static readonly DATA_FILES = [
		"contactInfo",
		"experience",
		"projects",
		"blogPosts",
		"presentations",
		"videos"
	] as const;

	private contactClickHandler?: (event: MouseEvent) => void;

	public onInit(): void {
		const model = new JSONModel({
			contactInfo: [],
			experience: [],
			projects: [],
			blogPosts: [],
			presentations: [],
			videos: []
		});
		this.getView().setModel(model, "profileData");
		this.loadAllData();

		this.getView().addEventDelegate({
			onAfterRendering: () => {
				this.bindContactClickHandler();
			}
		});
	}

	public onExit(): void {
		const domRef = this.getView().getDomRef();
		if (domRef && this.contactClickHandler) {
			domRef.removeEventListener("click", this.contactClickHandler);
		}
		this.contactClickHandler = undefined;
	}

	private loadAllData(): void {
		const model = this.getView().getModel("profileData");
		if (!(model instanceof JSONModel)) {
			return;
		}

		Main.DATA_FILES.forEach(dataName => this.loadJsonFile(dataName, model));
	}

	private loadJsonFile(dataName: (typeof Main.DATA_FILES)[number], model: JSONModel): void {
		const path = `./data/${dataName}.json`;

		fetch(path)
			.then(response => response.json())
			.then(data => {
				model.setProperty(`/${dataName}`, data);
			})
			.catch(error => {
				console.error(`Error loading ${dataName}:`, error);
			});
	}

	private bindContactClickHandler(): void {
		const domRef = this.getView().getDomRef();
		if (!domRef) {
			return;
		}

		if (this.contactClickHandler) {
			domRef.removeEventListener("click", this.contactClickHandler);
		}

		this.contactClickHandler = (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof HTMLElement)) {
				return;
			}

			const clickableItem = target.closest(".clickableItem");
			if (!clickableItem || target.closest("a")) {
				return;
			}

			const link = clickableItem.querySelector<HTMLAnchorElement>("a");
			if (!link?.href) {
				return;
			}

			this.navigateToUrl(link.href, link.target || "_blank");
		};

		domRef.addEventListener("click", this.contactClickHandler);
	}

	private navigateToUrl(url: string, target = "_blank"): void {
		if (url.startsWith("mailto:")) {
			window.location.href = url;
			return;
		}
		window.open(url, target);
	}

	public onNavigateToImpressum(): void {
		const router = this.getRouter();
		router.navTo("impressum", {}, false);
	}

	public onNavigateToProfile(event: Event): void {
		const source = event.getSource();
		if (!(source instanceof StandardListItem)) {
			return;
		}

		const customData = source.getCustomData().find(data => data instanceof CustomData);
		const url = String(customData?.getValue() ?? "");

		if (!url) {
			MessageBox.error("No URL provided for this profile.");
			return;
		}
		this.navigateToUrl(url, "_blank");
	}
}
