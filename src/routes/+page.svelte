<script>
    import {Alert, Button, Heading, Input, Spinner} from 'flowbite-svelte';
    import {goto} from "$app/navigation";

    import Cookies from 'js-cookie';
    import {_createGame, _joinGame} from "./+page.js";
    import {onMount} from "svelte";

    let userId = Cookies.get('userId');
    let isLoading = false;
    const rememberUser = () => {
        // Generate a unique identifier for the user or use any existing identifier
        userId = generateUniqueId();

        // Set the cookie to remember the user
        Cookies.set('userId', userId, { expires: 365 }); // Expires in 365 days
    };

    const generateUniqueId = () => {
        // Implement your logic to generate a unique identifier
        // For example, you can use a UUID library like 'uuid'
        // import { v4 as uuidv4 } from 'uuid';
        // return uuidv4();
        return Math.random().toString(36).substr(2, 9); // Random alphanumeric string
    };


    let name = "";
    let code = "";
    let color_name = "gray";
    let color_code = "gray";
    let error = "";

    const handleJoin = async () => {
        isLoading = true;
        if (name && code) {
            let response = await _joinGame(code, name, userId);
            if (response.status === 200) {
                Cookies.set('gameId', code, { expires: 365 });
                console.log("Joining game with name: " + name + " and code: " + code);
                await goto('/game-lobby');
            } else {
                isLoading = false;
                error = "Er is iets fout gegaan, ben je zeker dat je de juiste code hebt?";
            }
            //alert("Joining game with name: " + name + " and code: " + code);
            //goto('/game-lobby');
        } else {
            color_name = name ? "green" : "red";
            color_code = code ? "green" : "red";
        }
    };

    const handleCreate = async () => {
        isLoading = true;
        let response = await _createGame(userId);
        const responseData = await response.json();
        console.log("Response: ", responseData);

        if (response.status === 200) {
            Cookies.set('gameId', responseData.id, { expires: 365 });
            console.log("Creating game with name: " + name + " and code: " + code);
            code = responseData.id;
            await handleJoin();
        } else {
            isLoading = false;
            error = "Er is iets fout gegaan, probeer het later opnieuw.";
        }

    };

    onMount(async () => {
        if (userId) {
            console.log("User ID: " + userId);
        } else {
            rememberUser();
        }
    });



</script>

<main>
      <div class="flex-col flex gap-3 center-div">
          <Heading class="mt-7 " customSize="text-4xl">Welkom bij JachtSeizoen!</Heading>
          <p>Vul je naam in en de spelcode van een bestaand spel, of maak zelf een spel.</p>

        {#if error}
            <Alert color="red">
                <span class="font-medium">{error}</span>
            </Alert>
        {/if}
        <Input
                bind:value={name}
                color={color_name}
                id="large-input"
                size="lg"
                placeholder="Naam"
                on:blur={() => (color_name = name ? "green" : "red")}
        />
        <Input
                bind:value={code}
                color={color_code}
                id="large-input"
                size="lg"
                placeholder="Spelcode"
                on:blur={() => (color_code = code ? "green" : "red")}
        />
        {#if isLoading}
            <Spinner/>
        {/if}
        {#if !isLoading}
            <Button on:click={handleJoin} disabled={!name || !code}>Meedoen</Button>
        {/if}
          <div id="divider">
              <span></span>
              <p class="text-sm dark:text-white">Of</p>
              <span></span>
          </div>
          <div class="flex gap-3 flex-col"><Input
                  bind:value={name}
                  color={color_name}
                  id="large-input"
                  size="lg"
                  placeholder="Naam"
                  on:blur={() => (color_name = name ? "green" : "red")}
          />
              <Button on:click={handleCreate} disabled={!name}>Maak zelf een spel</Button>
          </div>
          <button on:click={() => {goto("/map-test")}}><i class="fa-regular fa-map m-2"></i></button>
    </div>



</main>

<style lang="scss">
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: rgb(255,228,222);
    background: linear-gradient(0deg, rgba(255,228,222,1) 0%, rgba(148,187,233,1) 100%);

    .center-div {
      max-width: 80vw;
      height: 100%;
      margin: auto;
    }
    #divider {
      display: flex;
      align-items: center;
      margin: 1rem 0;

      span {
        flex: 1;
        height: 2px;
        background-color: #000000;
      }

      p {
        margin: 0 1rem;
      }
    }
  }
</style>