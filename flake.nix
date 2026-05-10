{
  description = "Nixos config flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    sops-nix = {
      url = "github:Mic92/sops-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    stylix.url = "github:danth/stylix";

    hyprpanel = {
      url = "github:Jas-SinghFSU/HyprPanel";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    claude-code-nix = {
      url = "github:sadjow/claude-code-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

  };

  outputs = {
    self,
    nixpkgs,
    sops-nix,
    ...
  } @ inputs: let
    system = "x86_64-linux";
    user = "korazza";
    host = "desktop";
    language = "it_IT";
    timeZone = "Europe/Rome";

    pkgs = nixpkgs.legacyPackages.${system};
  in {
    nixosConfigurations.${host} = nixpkgs.lib.nixosSystem {
      specialArgs = {
        inherit
          system
          user
          host
          language
          timeZone
          inputs
          ;
      };
      modules = [
        ./hosts/${host}/configuration.nix
        inputs.stylix.nixosModules.stylix
        sops-nix.nixosModules.sops
      ];
    };

    formatter.${system} = nixpkgs.legacyPackages.${system}.alejandra;
  };
}
