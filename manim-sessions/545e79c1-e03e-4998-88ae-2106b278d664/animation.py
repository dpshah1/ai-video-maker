from manim import *

class GraphTheoryVideo(Scene):
    def construct(self):

        title = Text("Networks, Bridges, and Coloring", font_size=48)
        title.to_edge(UP, buff=0.5)

        intro_text = Text("The Königsberg Bridge Problem", font_size=36)
        intro_text.next_to(title, DOWN, buff=0.8)

        self.play(Write(title))
        self.play(Write(intro_text))
        self.wait(1)

        river = Line(LEFT * 3, RIGHT * 3).set_color(BLUE)
        bridge1 = Line(LEFT * 2 + UP * 1, LEFT * 2 + DOWN * 1).set_color(YELLOW)
        bridge2 = Line(LEFT * 1 + UP * 1, LEFT * 1 + DOWN * 1).set_color(YELLOW)
        bridge3 = Line(ORIGIN + UP * 1, ORIGIN + DOWN * 1).set_color(YELLOW)
        bridge4 = Line(RIGHT * 1 + UP * 1, RIGHT * 1 + DOWN * 1).set_color(YELLOW)
        bridge5 = Line(RIGHT * 2 + UP * 1, RIGHT * 2 + DOWN * 1).set_color(YELLOW)

        self.play(Create(river), Create(bridge1), Create(bridge2), Create(bridge3), Create(bridge4), Create(bridge5))
        self.wait(2)

        self.play(FadeOut(river), FadeOut(bridge1), FadeOut(bridge2), FadeOut(bridge3), FadeOut(bridge4), FadeOut(bridge5))

        vertices = [Circle(radius=0.1).set_color(WHITE).move_to(LEFT * 2 + UP * 1),
                    Circle(radius=0.1).set_color(WHITE).move_to(LEFT * 2 + DOWN * 1),
                    Circle(radius=0.1).set_color(WHITE).move_to(LEFT * 1 + UP * 1),
                    Circle(radius=0.1).set_color(WHITE).move_to(ORIGIN + UP * 1),
                    Circle(radius=0.1).set_color(WHITE).move_to(RIGHT * 1 + UP * 1),
                    Circle(radius=0.1).set_color(WHITE).move_to(RIGHT * 2 + UP * 1)]

        edges = [Line(vertices[0].get_center(), vertices[1].get_center()).set_color(YELLOW),
                 Line(vertices[1].get_center(), vertices[2].get_center()).set_color(YELLOW),
                 Line(vertices[2].get_center(), vertices[3].get_center()).set_color(YELLOW),
                 Line(vertices[3].get_center(), vertices[4].get_center()).set_color(YELLOW),
                 Line(vertices[4].get_center(), vertices[5].get_center()).set_color(YELLOW)]

        for vertex in vertices:
            self.play(Create(vertex))
        for edge in edges:
            self.play(Create(edge))
        self.wait(2)

        self.play(FadeOut(title), FadeOut(intro_text), *[FadeOut(v) for v in vertices], *[FadeOut(e) for e in edges])
        self.wait(1)

        formal_title = Text("Defining Graphs", font_size=36)
        formal_title.to_edge(UP, buff=0.5)

        self.play(Write(formal_title))
        self.wait(1)

        vertex_def = MathTex("V=\\{A, B, C, D, E, F\\}", font_size=36)
        edge_def = MathTex("E=\\{(A, B), (B, C), (C, D), (D, E), (E, F)\\}", font_size=36)

        vertex_def.next_to(formal_title, DOWN, buff=0.8)
        edge_def.next_to(vertex_def, DOWN, buff=0.8)

        self.play(Write(vertex_def))
        self.wait(1)
        self.play(Write(edge_def))
        self.wait(2)

        self.play(FadeOut(formal_title), FadeOut(vertex_def), FadeOut(edge_def))
        self.wait(1)

        path_title = Text("Paths, Walks, and Cycles", font_size=36)
        path_title.to_edge(UP, buff=0.5)

        self.play(Write(path_title))
        self.wait(1)

        path_def = MathTex("x")
        walk_def = MathTex("x")
        cycle_def = MathTex("x")

        path_def.next_to(path_title, DOWN, buff=0.8)
        walk_def.next_to(path_def, DOWN, buff=0.8)
        cycle_def.next_to(walk_def, DOWN, buff=0.8)

        self.play(Write(path_def))
        self.wait(1)
        self.play(Write(walk_def))
        self.wait(1)
        self.play(Write(cycle_def))
        self.wait(2)

        self.play(FadeOut(path_title), FadeOut(path_def), FadeOut(walk_def), FadeOut(cycle_def))
        self.wait(1)

        euler_title = Text("The Eulerian Tour", font_size=36)
        euler_title.to_edge(UP, buff=0.5)

        self.play(Write(euler_title))
        self.wait(1)

        euler_theorem = MathTex("x")
        euler_theorem.next_to(euler_title, DOWN, buff=0.8)

        self.play(Write(euler_theorem))
        self.wait(2)

        self.play(FadeOut(euler_title), FadeOut(euler_theorem))
        self.wait(1)

        planarity_title = Text("Planarity and Euler's Formula", font_size=36)
        planarity_title.to_edge(UP, buff=0.5)

        self.play(Write(planarity_title))
        self.wait(1)

        euler_formula = MathTex("v - e + f=2", font_size=36)
        euler_formula.next_to(planarity_title, DOWN, buff=0.8)

        self.play(Write(euler_formula))
        self.wait(2)

        self.play(FadeOut(planarity_title), FadeOut(euler_formula))
        self.wait(1)

        non_planar_title = Text("Non-Planar Graphs", font_size=36)
        non_planar_title.to_edge(UP, buff=0.5)

        self.play(Write(non_planar_title))
        self.wait(1)

        k5_def = MathTex("x")
        k33_def = MathTex("x")

        k5_def.next_to(non_planar_title, DOWN, buff=0.8)
        k33_def.next_to(k5_def, DOWN, buff=0.8)

        self.play(Write(k5_def))
        self.wait(1)
        self.play(Write(k33_def))
        self.wait(2)

        self.play(FadeOut(non_planar_title), FadeOut(k5_def), FadeOut(k33_def))
        self.wait(1)

        coloring_title = Text("Graph Coloring", font_size=36)
        coloring_title.to_edge(UP, buff=0.5)

        self.play(Write(coloring_title))
        self.wait(1)

        four_color = MathTex("x")
        four_color.next_to(coloring_title, DOWN, buff=0.8)

        self.play(Write(four_color))
        self.wait(2)

        self.play(FadeOut(coloring_title), FadeOut(four_color))
        self.wait(1)

        types_title = Text("Types of Graphs", font_size=36)
        types_title.to_edge(UP, buff=0.5)

        self.play(Write(types_title))
        self.wait(1)

        complete_graph = MathTex("x")
        tree_def = MathTex("x")
        hypercube_def = MathTex("x")

        complete_graph.next_to(types_title, DOWN, buff=0.8)
        tree_def.next_to(complete_graph, DOWN, buff=0.8)
        hypercube_def.next_to(tree_def, DOWN, buff=0.8)

        self.play(Write(complete_graph))
        self.wait(1)
        self.play(Write(tree_def))
        self.wait(1)
        self.play(Write(hypercube_def))
        self.wait(2)

        self.play(FadeOut(types_title), FadeOut(complete_graph), FadeOut(tree_def), FadeOut(hypercube_def))
        self.wait(1)

        conclusion_title = Text("The Beauty of Graph Theory", font_size=48)
        conclusion_title.to_edge(UP, buff=0.5)

        conclusion_text = Text("From puzzles to profound insights, graph theory connects us.", font_size=36)
        conclusion_text.next_to(conclusion_title, DOWN, buff=0.8)

        self.play(Write(conclusion_title))
        self.wait(1)
        self.play(Write(conclusion_text))
        self.wait(3)

        self.play(FadeOut(conclusion_title), FadeOut(conclusion_text))
        self.wait(1)